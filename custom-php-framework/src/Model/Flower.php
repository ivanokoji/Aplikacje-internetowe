<?php
namespace App\Model;

use App\Service\Config;

class Flower
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $color = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Flower
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Flower
    {
        $this->name = $name;
        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): Flower
    {
        $this->color = $color;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Flower
    {
        $this->description = $description;
        return $this;
    }

    public static function fromArray($array): Flower
    {
        $flower = new self();
        $flower->fill($array);
        return $flower;
    }

    public function fill($array): Flower
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['color'])) {
            $this->setColor($array['color']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM flower';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $flowers = [];
        $flowersArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($flowersArray as $flowerArray) {
            $flowers[] = self::fromArray($flowerArray);
        }

        return $flowers;
    }

    public static function find($id): ?Flower
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM flower WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $flowerArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $flowerArray) {
            return null;
        }

        return Flower::fromArray($flowerArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

        if (! $this->getId()) {
            $sql = "INSERT INTO flower (name, color, description)
                    VALUES (:name, :color, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name'        => $this->getName(),
                'color'       => $this->getColor(),
                'description' => $this->getDescription(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE flower
                    SET name = :name,
                        color = :color,
                        description = :description
                    WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name'        => $this->getName(),
                ':color'       => $this->getColor(),
                ':description' => $this->getDescription(),
                ':id'          => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM flower WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setColor(null);
        $this->setDescription(null);
    }
}
